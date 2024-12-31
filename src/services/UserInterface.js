import React, { useState, useEffect } from 'react';
import UserBooks from './UserBooks';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/UserInterface.css';
import documentService from '../services/documentService';

const UserInterface = () => {
    const [view, setView] = useState('catalogue');
    const [filters, setFilters] = useState({
        keywords: '',
        availableOnly: false,
        category: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const fetchedDocuments = await documentService.getAllDocuments();
                setDocuments(fetchedDocuments);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            }
        };

        fetchDocuments();
    }, []);

    const handleAvailabilityChange = () => {
        setFilters((prevFilters) => ({ ...prevFilters, availableOnly: !prevFilters.availableOnly }));
    };

    const handleKeywordChange = (event) => {
        setFilters((prevFilters) => ({ ...prevFilters, keywords: event.target.value }));
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredBooks = documents.filter((book) => {
        const bookTitle = book.titre ? book.titre.toLowerCase() : '';
        const bookAuthors = Array.isArray(book.auteurs) 
        ? book.auteurs.map((author) => author.toLowerCase()) 
        : book.auteurs ? [book.auteurs.toLowerCase()] : [];

        const matchesKeywords =
            searchTerm === '' || 
            bookTitle.includes(searchTerm.toLowerCase()) || 
            bookAuthors.some((author) => author.includes(searchTerm));

        const matchesAvailability = !filters.availableOnly || book.available;

        const matchesCategory = filters.category === '' || book.category === filters.category;

        return matchesAvailability && matchesKeywords && matchesCategory;
    });

    const noBooksFound = filteredBooks.length === 0;

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container user-interface">
            <form className="search-container mb-4">
                <input 
                    type="text" 
                    placeholder="Rechercher par titre ou auteur..." 
                    className="search-bar" 
                    value={searchTerm}
                    onChange={handleSearchChange} 
                />
                <i className="fas fa-search search-icon"></i>
            </form>

            {view === 'catalogue' && (
                <div className="row">
                    <div className="col-md-1">
                        {/* Peut-être des filtres supplémentaires à ajouter ici */}
                    </div>
                    <div className="col-md-9">
                        {noBooksFound ? (
                            <div className="no-books-message">
                                <p>Aucun livre trouvé pour cette recherche.</p>
                            </div>
                        ) : (
                            <UserBooks booksData={currentBooks} />
                        )}

                        {!noBooksFound && (
                            <nav className="mt-2">
                                <ul className="pagination justify-content-center">
                                    {[...Array(totalPages).keys()].map((number) => (
                                        <li
                                            key={number}
                                            className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                                            onClick={() => handlePageChange(number + 1)}
                                        >
                                            <span className="page-link">{number + 1}</span>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInterface;
